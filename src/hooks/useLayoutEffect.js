/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that sets
 * an attribute on the document element indicating that scrolling should be
 * locked. This is performed with a layout effect (before paint).
 */

import { useLayoutEffect } from 'react';

/**
 *
 * @param {Boolean} sidebarIsOpened
 */
export const useToggleSidebarClass = sidebarIsOpened => {
    useLayoutEffect(() => {
        document.body.classList.toggle('nav-active', sidebarIsOpened);
    }, [sidebarIsOpened]);
};

/**
 *
 * @param {Boolean} modalIsOpened
 */
export const useToggleModalClass = modalIsOpened => {
    useLayoutEffect(() => {
        document.body.classList.toggle('modal-open', modalIsOpened);

        return () => {
            // When component using this hook unmout, we remove class too
            document.body.classList.toggle('modal-open', false);
        };
    }, [modalIsOpened]);
};
