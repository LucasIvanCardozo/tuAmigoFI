import Highlight from 'react-highlight';
import 'highlight.js/styles/atom-one-dark.css';

interface Params {
  code: string;
}

export const Code = ({ code }: Params) => {
  return <Highlight>{code}</Highlight>;
};
