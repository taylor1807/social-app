"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { styled } from "@stitches/react";

//function to have tooltips on some of the buttons
export default function TooltipButton({ onClick, buttonText, tooltipText }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          onClick={onClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {buttonText}
        </button>
      </Tooltip.Trigger>
      <StyledTooltip side="top">
        {tooltipText}
        <Tooltip.Arrow />
      </StyledTooltip>
    </Tooltip.Root>
  );
}

//styling the tooltip popout with stitches
const StyledTooltip = styled(Tooltip.Content, {
  backgroundColor: "black",
  color: "white",
  borderRadius: 4,
  padding: "8px",
  fontSize: "12px",
});
