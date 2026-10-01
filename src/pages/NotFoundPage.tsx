import { Button } from '../components/ui/primitives';

export function NotFoundPage() {
  return (
    <div className="container page empty">
      <h1 className="page-title">Off the pitch</h1>
      <p className="muted">That page doesn't exist in the prototype.</p>
      <Button to="/">Back home</Button>
    </div>
  );
}
