import type { ComponentChildren, HTMLAttributes } from 'preact';

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'id'> {
  id?: string;
  children?: ComponentChildren;
}

export function SectionHeading(props: SectionHeadingProps) {
  const { children, ...attributes } = props;
  Reflect.deleteProperty(attributes, 'id');

  return (
    <h2 data-section-heading {...attributes}>
      {children}
    </h2>
  );
}
