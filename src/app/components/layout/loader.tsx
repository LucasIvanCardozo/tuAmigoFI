import { Loading } from './loading';

export const Loader = () => {
  return (
    <div className="fixed bottom-0 right-0 m-4">
      <Loading mode="black" size={6} />
    </div>
  );
};
