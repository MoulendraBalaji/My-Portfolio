import { ArrowUpRight } from 'lucide-react';

import Magnetic from '../ui/Magnetic.jsx';
import ProjectsIndex from './ProjectsIndex.jsx';
import SectionHeading from './SectionHeading.jsx';
import {
  projectIndex,
  projectsGithubUrl,
  projectsIndexHasMore,
  projectsTotalCount,
  sectionMeta
} from '../../data/portfolio.js';
import './Projects.css';

/**
 * Projects — "Editorial Index + Live Preview".
 *
 * Deliberately no sticky positioning and no scroll-linked animation: both were
 * what made the previous stacked deck long, fragile, and (with tall content)
 * capable of rendering as blank cards. Everything here is driven by hover,
 * focus, click, and one entrance — see ProjectsIndex.jsx.
 *
 * The list and preview are separate client components; the copy and data live in
 * data/portfolio.js. This is a Vite SPA, so there are no Server Components to
 * hoist the shell into — the boundary is kept for code-organisation parity.
 */
export default function Projects() {
  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="shell">
        <SectionHeading
          id="projects-title"
          index={sectionMeta.projects.index}
          label={sectionMeta.projects.label}
          title="Selected"
          accent="work"
        >
          A shortlist rather than a full dump — eight pieces that cover applied ML,
          edge and mobile, systems, and research. Hover, focus or tap any row to
          preview it.
        </SectionHeading>

        <ProjectsIndex projects={projectIndex} />

        {projectsIndexHasMore && projectsGithubUrl ? (
          <div className="projects__more">
            <Magnetic>
              <a className="btn btn--ghost" href={projectsGithubUrl}>
                All projects on GitHub
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </a>
            </Magnetic>
            <p className="projects__more-note">
              {projectIndex.length} of {projectsTotalCount} shown.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}