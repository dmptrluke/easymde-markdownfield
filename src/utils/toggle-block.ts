import { EditorSelection, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import escapeStringRegexp from 'escape-string-regexp';

/**
 * Checks whether the selection matches a formatted block of text.
 */
export const checkBlock = (
    editor: EditorView,
    characters: string,
    minimal = false,
): RegExpExecArray | null => {
    //  Checks whether the selection matches a block of formatted text.

    const { state } = editor;
    const { from, to } = getExpandedSelection(state, characters, minimal);
    const text = state.sliceDoc(from, to);
    const escapedCharacters = escapeStringRegexp(characters);
    const regularExpression = new RegExp(
        `^${escapedCharacters}(.*)${escapedCharacters}$`,
        'gs',
    );

    const checkResult = regularExpression.exec(text);

    let doubleCharactersCheckResult = null;
    let tripleCharactersCheckResult = null;
    if (characters.length === 1) {
        doubleCharactersCheckResult = checkBlock(editor, characters.repeat(2), minimal);
        tripleCharactersCheckResult = checkBlock(editor, characters.repeat(3), minimal);
    }

    if (
        (checkResult &&
            doubleCharactersCheckResult &&
            tripleCharactersCheckResult) ||
        (checkResult &&
            !doubleCharactersCheckResult &&
            tripleCharactersCheckResult) ||
        (checkResult &&
            !doubleCharactersCheckResult &&
            !tripleCharactersCheckResult)
    ) {
        return checkResult;
    }

    return null;
};

/**
 * Toggles a block of text to be formatted.
 */
export const toggleBlock = (editor: EditorView, characters: string) => {
    const { state } = editor;
    const { from, to } = getExpandedSelection(state, characters);
    const text = state.sliceDoc(from, to);
    const textMatch = checkBlock(editor, characters);
    console.log(from, to, text, textMatch);

    editor.dispatch(
        state.changeByRange(() =>
            textMatch
                ? {
                      changes: [{ from, insert: textMatch[1], to }],
                      range: EditorSelection.range(
                          from,
                          to - (characters.length + characters.length),
                      ),
                  }
                : {
                      changes: [
                          {
                              from,
                              insert: `${characters}${text}${characters}`,
                              to,
                          },
                      ],
                      range: EditorSelection.range(
                          from,
                          to + (characters.length + characters.length),
                      ),
                  },
        ),
    );

    editor.focus();
};

/**
 * Attempts to expand the cursor selection to the nearest logical block of text needs to be formatted.
 */
export const getExpandedSelection = (
    state: EditorState,
    characters: string,
    minimal = false,
): { from: number; to: number } => {
    let { from, to } = state.selection.main;

    let fromPosition = from;
    while (fromPosition >= 0) {
        const newText = state.sliceDoc(fromPosition, to);

        if (newText.startsWith('\n') || newText.startsWith('\t')) {
            fromPosition++;
            break;
        } else if (minimal && newText.startsWith(' ')) {
            fromPosition++;
            break;
        } else if (newText.startsWith(characters + ' ')) {
            fromPosition += characters.length + 1;
            break;
        } else if (
            newText.length > characters.length &&
            newText.startsWith(characters)
        ) {
            break;
        }

        fromPosition--;
    }
    from = fromPosition;

    let toPosition = to;
    while (toPosition < state.doc.length) {
        const newText = state.sliceDoc(from, toPosition);
        if (newText.endsWith('\n') || newText.endsWith('\t')) {
            toPosition--;
            break;
        } else if (minimal && newText.endsWith(' ')) {
            toPosition--;
            break;
        } else if (
            newText.length > characters.length &&
            newText.endsWith(characters)
        ) {
            break;
        }
        toPosition++;
    }
    to = toPosition;

    return correctInvalidSelection({ from, to });
};

/**
 * Sometimes the selection expands beyond the start of the document, which causes an error.
 * This function corrects the selection if it is invalid.
 */
const correctInvalidSelection = ({
    from,
    to,
}: {
    from: number;
    to: number;
}): { from: number; to: number } => {
    if (from < 0) {
        from = 0;
    }

    return { from, to };
};
