import React from "react";

function Button({
    children,
    variant = "freelancer",
    size="md",
    onClick,
    type ="button",
    className = "",
    as: Component = "button",
  ...props
})
 {
  const variants = {
    freelancer: `
       bg-gradient-to-r
       from-freelancer-primary
       to-freelancer-secondary
      hover:opacity-90
      text-white
    `,

    client: `
      bg-gradient-to-r
      from-client-primary
      to-client-secondary
      hover:bg-gray-200
      text-white
    `,
  };
   const baseStyles = 
   `rounded-lg
    font-medium
    transition
    duration-200
    cursor-pointer`;


  const sizes = {
    sm: "px-3 py-1.5 text-sm",

    md: "px-5 py-2.5",

    lg: "px-7 py-3 text-lg"
  };

return<>
     <Component
      type={Component === "button" ? type : undefined}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
    </>
}
export default Button;