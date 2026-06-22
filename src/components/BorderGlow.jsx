export default function BorderGlow({ as: Element = "div", className = "", children, ...props }) {
  return (
    <Element className={`border-glow ${className}`.trim()} {...props}>
      {children}
    </Element>
  );
}
