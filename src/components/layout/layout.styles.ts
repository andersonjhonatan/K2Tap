/**
 * Tailwind utilities for the shared layout.
 * The semantic hook at the start of each value scopes arbitrary descendant variants.
 */
const styles = {
  brandLink: `tw-components-layout-layout-brandLink [border-radius:14px]`,
  desktopNav: `tw-components-layout-layout-desktopNav [display:flex] [align-items:center] [gap:28px] [color:#3d4958] [font-size:0.8rem] [&_a]:[position:relative] [&_a]:[padding-block:10px] [&_a::after]:[position:absolute] [&_a::after]:[right:0] [&_a::after]:[bottom:4px] [&_a::after]:[left:0] [&_a::after]:[height:1px] [&_a::after]:[transform:scaleX(0)] [&_a::after]:[transform-origin:right] [&_a::after]:[background:var(--blue)] [&_a::after]:[content:''] [&_a::after]:[transition:transform_220ms_ease] [&_a:hover::after]:[transform:scaleX(1)] [&_a:hover::after]:[transform-origin:left] max-[920px]:[display:none]`,
  footer: `tw-components-layout-layout-footer [padding:76px_0_34px] [background:var(--deep)] [color:white] [text-align:center] max-[600px]:[padding:58px_0_30px]`,
  footerBottom: `tw-components-layout-layout-footerBottom [display:flex] [align-items:center] [justify-content:center] [gap:10px] [color:#6f8499] [font-size:0.66rem] max-[600px]:[flex-direction:column] max-[600px]:[gap:5px]`,
  footerDivider: `tw-components-layout-layout-footerDivider [width:min(680px,_100%)] [height:1px] [margin:36px_auto_24px] [background:linear-gradient(90deg,_transparent,_rgb(255_255_255_/_14%),_transparent)] max-[600px]:[margin:28px_auto_20px]`,
  footerInner: `tw-components-layout-layout-footerInner [display:flex] [flex-direction:column] [align-items:center]`,
  footerLogo: `tw-components-layout-layout-footerLogo [display:block] [width:auto] [height:158px] [margin-bottom:22px]`,
  footerNav: `tw-components-layout-layout-footerNav [display:flex] [flex-wrap:wrap] [justify-content:center] [gap:8px] [margin-top:30px] [&_a]:[padding:10px_14px] [&_a]:[border:1px_solid_transparent] [&_a]:[border-radius:999px] [&_a]:[color:#c7d5e5] [&_a]:[font-size:0.75rem] [&_a]:[font-weight:750] [&_a]:[transition:border-color_220ms_ease,_background_220ms_ease] [&_a:hover]:[border-color:rgb(255_255_255_/_10%)]! [&_a:hover]:[background:rgb(255_255_255_/_4%)] max-[600px]:[gap:4px] max-[600px]:[margin-top:24px] max-[600px]:[&_a]:[padding:9px_10px]`,
  footerTagline: `tw-components-layout-layout-footerTagline [max-width:520px] [margin:14px_auto_0] [color:#93a8bf] [font-size:0.78rem] [line-height:1.65]`,
  header: `tw-components-layout-layout-header [position:sticky] [z-index:50] [top:0] [border-bottom:1px_solid_rgb(7_17_31_/_6%)] [background:rgb(244_247_250_/_82%)] [backdrop-filter:blur(18px)]`,
  headerActions: `tw-components-layout-layout-headerActions [display:flex] [align-items:center] [gap:10px]`,
  headerCta: `tw-components-layout-layout-headerCta [display:inline-flex] [min-height:42px] [align-items:center] [justify-content:center] [gap:8px] [padding:10px_17px] [border:1px_solid_var(--ink)] [border-radius:999px] [background:var(--ink)] [color:white] [font-size:0.78rem] [font-weight:750] [transition:transform_220ms_ease,_box-shadow_220ms_ease] [&:hover]:[transform:translateY(-2px)] [&:hover]:[box-shadow:var(--shadow)] max-[920px]:[display:none]`,
  headerInner: `tw-components-layout-layout-headerInner [display:flex] [height:78px] [align-items:center] [justify-content:space-between] [gap:24px] max-[600px]:[height:68px]`,
  menuButton: `tw-components-layout-layout-menuButton [display:none] [width:42px] [height:42px] [place-items:center] [border:1px_solid_var(--line)] [border-radius:50%] [background:white] [color:var(--ink)] [cursor:pointer] max-[920px]:[display:grid]`,
  mobileCommercial: `tw-components-layout-layout-mobileCommercial [margin-top:7px] [background:var(--ink)] [color:white]!`,
  mobileNav: `tw-components-layout-layout-mobileNav [display:grid] [gap:6px] [&_a]:[display:flex] [&_a]:[min-height:48px] [&_a]:[align-items:center] [&_a]:[justify-content:space-between] [&_a]:[padding:0_14px] [&_a]:[border-radius:14px] [&_a]:[color:#354254] [&_a]:[font-size:0.9rem] [&_a]:[font-weight:700] [&_a:hover]:[background:white]`,
  mobilePanel: `tw-components-layout-layout-mobilePanel [position:absolute] [top:calc(100%_+_1px)] [right:0] [left:0] [padding:12px_13px_18px] [border-bottom:1px_solid_var(--line)] [background:rgb(244_247_250_/_98%)] [box-shadow:0_20px_40px_rgb(7_17_31_/_12%)]`,
  mobilePurchase: `tw-components-layout-layout-mobilePurchase [background:linear-gradient(135deg,_#197df1,_#0b5ecb)] [color:white]!`,
  separator: `tw-components-layout-layout-separator [width:3px] [height:3px] [border-radius:50%] [background:#40566d] max-[600px]:[display:none]`,
} as const

export default styles
