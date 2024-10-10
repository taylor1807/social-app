"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { styled } from "@stitches/react";
import Link from "next/link";

const StyledTooltip = styled(Tooltip.Content, {
  backgroundColor: "black",
  color: "white",
  borderRadius: 4,
  padding: "8px",
  fontSize: "12px",
});

const StyledLink = styled(Link, {
  color: "lightblue",
  "&:hover": {
    color: "blue",
  },
});

const TooltipLink = ({ href, linkText, tooltipText }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <StyledLink href={href}>{linkText}</StyledLink>
      </Tooltip.Trigger>
      <StyledTooltip side="top">
        {tooltipText}
        <Tooltip.Arrow />
      </StyledTooltip>
    </Tooltip.Root>
  );
};

export default TooltipLink;
