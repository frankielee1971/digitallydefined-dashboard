import React from "react";
import "./brand-logo.css";

export default function BrandLogo({ className = "" }) {
  return (
    <div className={`dd-brand-logo ${className}`.trim()} aria-label="DigitallyDefined logo">
      <span className="dd-brand-logo__digitally">Digitally</span>
      <span className="dd-brand-logo__defined">Defined</span>
    </div>
  );
}