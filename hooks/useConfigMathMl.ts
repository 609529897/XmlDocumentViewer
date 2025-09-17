import { useEffect } from "react";

// MathML配置函数
const configMathML = () => {
  const namespaceURI = 'http://www.w3.org/1998/Math/MathML';
  const mathElement = document.body.getElementsByTagNameNS(namespaceURI, 'math')[0];
  if (!mathElement) return;

  const testDiv = document.createElement('div');
  testDiv.style.cssText =
    'border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;';
  testDiv.innerHTML = `<math xmlns='${namespaceURI}'><mspace height='23px' width='77px'></mspace></math>`;
  document.body.appendChild(testDiv);

  const box = (testDiv.firstChild as any)?.firstChild?.getBoundingClientRect();
  document.body.removeChild(testDiv);

  if (box && (Math.abs(box.height - 23) > 1 || Math.abs(box.width - 77) > 1)) {
    const link = document.createElement('link');
    Object.assign(link, {
      href: '/mathml.css',
      rel: 'stylesheet',
      type: 'text/css',
    });
    document.head.appendChild(link);
  }
};

export function useConfigMathMl () {
  useEffect(() => {
    configMathML();
  }, []);
}