import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface Params {
  code: string;
}

export const Code = ({ code }: Params) => {
  const codeRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      const resultado = hljs.highlightAuto(code);
      codeRef.current.innerHTML = resultado.value;
    }
  }, [code]);

  return (
    <pre>
      <code ref={codeRef}>{code}</code>
    </pre>
  );
};
