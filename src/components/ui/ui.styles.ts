/**
 * Tailwind utilities for shared UI components.
 * The semantic hook at the start of each value scopes arbitrary descendant variants.
 */
const styles = {
  brand: `tw-components-ui-ui-brand [display:inline-flex] [align-items:center] [gap:11px] [min-width:max-content] max-[600px]:[gap:8px] max-[600px]:[font-size:1rem]`,
  brandBy: `tw-components-ui-ui-brandBy [color:var(--muted)] [font-size:0.6rem] [font-weight:800] [letter-spacing:0.12em] [text-transform:uppercase] [white-space:nowrap] max-[560px]:[display:none]`,
  brandLogo: `tw-components-ui-ui-brandLogo [display:block] [width:auto] [height:46px] max-[560px]:[height:40px]`,
  brandMark: `tw-components-ui-ui-brandMark [display:block] [width:auto] [height:40px] max-[600px]:[width:34px] max-[600px]:[height:34px] max-[600px]:[border-radius:11px] max-[600px]:[font-size:0.7rem]`,
  button: `tw-components-ui-ui-button [display:inline-flex] [min-height:48px] [align-items:center] [justify-content:center] [gap:10px] [padding:14px_21px] [border:0] [border-radius:999px] [cursor:pointer] [font-size:0.875rem] [font-weight:800] [transition:transform_250ms_ease,_box-shadow_250ms_ease,_background_250ms_ease] [&:hover]:[transform:translateY(-2px)]`,
  ghost: `tw-components-ui-ui-ghost [border:1px_solid_#cbd4de] [background:transparent]`,
  light: `tw-components-ui-ui-light [background:white] [color:var(--ink)]`,
  primary: `tw-components-ui-ui-primary [background:var(--ink)] [box-shadow:0_14px_34px_rgb(7_17_31_/_20%)] [color:white]`,
  reveal: `tw-components-ui-ui-reveal [opacity:0] [transform:translateY(22px)] [transition:opacity_800ms_ease,_transform_800ms_ease] motion-reduce:[opacity:1] motion-reduce:[transform:none]`,
  revealed: `tw-components-ui-ui-revealed [opacity:1] [transform:none]`,
} as const

export default styles
