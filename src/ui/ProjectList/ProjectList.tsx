import { css } from '../../../styled-system/css';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectItem {
  title: string;
  summary: string;
  tags: readonly string[];
  links: readonly ProjectLink[];
}

export interface ProjectListProps {
  projects: readonly ProjectItem[];
  emptyMessage: string;
}

const empty = css({
  color: 'text.muted',
  lineHeight: 1.8,
  fontSize: { base: '1em', md: '1.125em' }
});

const list = css({
  display: 'flex',
  flexDir: 'column',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  width: '100%'
});

const item = css({
  display: 'flex',
  flexDir: 'column',
  gap: '8px',
  paddingBlock: '24px',
  borderBottom: '1px solid {colors.text.muted}',
  _first: { paddingTop: 0 },
  _last: { borderBottom: 'none', paddingBottom: 0 }
});

const title = css({
  color: 'text',
  fontSize: { base: '1.25em', md: '1.5em' },
  fontWeight: 700
});

const titleLink = css({
  color: 'primary',
  textDecoration: 'underline',
  textUnderlineOffset: '0.2em'
});

const summary = css({
  color: 'text.muted',
  lineHeight: 1.8,
  fontSize: { base: '1em', md: '1.125em' }
});

const metaList = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  listStyle: 'none',
  margin: 0,
  padding: 0
});

const tag = css({
  color: 'text.muted',
  fontSize: '0.875rem'
});

const linkList = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  listStyle: 'none',
  margin: 0,
  padding: 0
});

const metaLink = css({
  color: 'primary',
  textDecoration: 'underline',
  textUnderlineOffset: '0.2em',
  fontSize: '0.875rem'
});

export function ProjectList({ projects, emptyMessage }: ProjectListProps) {
  if (projects.length === 0) {
    return <p class={empty}>{emptyMessage}</p>;
  }

  return (
    <ul class={list}>
      {projects.map(project => {
        const primaryLink = project.links[0];

        return (
          <li key={project.title} class={item}>
            <h3 class={title}>
              {primaryLink ? (
                <a href={primaryLink.href} class={titleLink}>
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h3>
            <p class={summary}>{project.summary}</p>
            {project.tags.length > 0 && (
              <ul class={metaList}>
                {project.tags.map(tagLabel => (
                  <li key={tagLabel} class={tag}>
                    {tagLabel}
                  </li>
                ))}
              </ul>
            )}
            {project.links.length > 0 && (
              <ul class={linkList}>
                {project.links.map(link => (
                  <li key={link.href}>
                    <a href={link.href} class={metaLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
