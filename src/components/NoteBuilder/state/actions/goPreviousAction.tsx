import { log } from "architecture";
import { t } from "architecture/lang";
import {
  NoteBuilderState,
  StoreNoteBuilderModifier,
} from "components/NoteBuilder";
import React from "react";

const goPreviousAction =
  (set: StoreNoteBuilderModifier, get: () => NoteBuilderState) => () => {
    const {
      previousSections,
      nextSections,
      position,
      section,
      header,
      builder,
    } = get();
    const previousPosition = position - 1;
    log.trace(`goPrevious from ${position} to ${previousPosition}`);

    const previousSection = previousSections.get(previousPosition);
    nextSections.set(position, {
      header: header,
      section: section,
      path: builder.getPath(previousPosition),
      element: builder.getElement(previousPosition),
    });
    previousSections.delete(previousPosition);
    nextSections.delete(position + 1);
    set({
      position: previousPosition,
      previousSections: previousSections,
      nextSections: nextSections,
      section: previousSection?.section || {
        color: "",
        element: <></>,
      },
      header: previousSection?.header || {
        title: t("flow_selector_placeholder"),
      },
      builder: builder.removePositionInfo(position),
    });
  };

export default goPreviousAction;
