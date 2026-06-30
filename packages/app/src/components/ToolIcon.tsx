import { categoryIconInner, iconInner } from '../lib/icons';

export interface ToolIconProps {
  id: string;
  size?: number;
  className?: string;
}

/** Renders a tool's inline line-art icon. Colour follows `currentColor`. */
export function ToolIcon({ id, size = 18, className }: ToolIconProps): React.JSX.Element {
  return (
    <svg
      className={`zi${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: iconInner(id) }}
    />
  );
}

export interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
}

/** Renders a category's inline line-art icon. Colour follows `currentColor`. */
export function CategoryIcon({
  category,
  size = 18,
  className,
}: CategoryIconProps): React.JSX.Element {
  return (
    <svg
      className={`zi${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: categoryIconInner(category) }}
    />
  );
}
