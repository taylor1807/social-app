"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { styled } from "@stitches/react";
import Link from "next/link";

//function to create tooltips on some of the links
export default function TooltipLink({
  href,
  linkText,
  tooltipText,
  className,
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <StyledLink href={href} className={className}>
          {linkText}
        </StyledLink>
      </Tooltip.Trigger>
      <StyledTooltip side="top">
        {tooltipText}
        <Tooltip.Arrow />
      </StyledTooltip>
    </Tooltip.Root>
  );
}

// styling the tootip popout with stitches
const StyledTooltip = styled(Tooltip.Content, {
  backgroundColor: "black",
  color: "white",
  borderRadius: 4,
  padding: "8px",
  fontSize: "12px",
});

//styling some of the links using stitches
const StyledLink = styled(Link, {
  color: "lightblue",
  "&:hover": {
    color: "blue",
  },
});
