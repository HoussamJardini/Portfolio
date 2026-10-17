// Collects every image / video dropped in src/assets/projects/<slug>/.
// A file named "x.poster.webp" is used as the poster of video "x.mp4".
const files = import.meta.glob('../assets/projects/*/*.{png,jpg,jpeg,webp,gif,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const bySlug = {};
for (const [path, url] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
  const [, slug, name] = path.match(/projects\/([^/]+)\/([^/]+)$/);
  (bySlug[slug] ||= []).push({ name, url });
}

const caption = (name) =>
  name.replace(/\.[^.]+$/, '').replace(/^\d+[-_]?/, '').replace(/[-_]+/g, ' ').trim();

export function mediaFor(slug) {
  const list = bySlug[slug] || [];
  const posters = Object.fromEntries(
    list.filter((f) => f.name.includes('.poster.')).map((f) => [f.name.split('.poster.')[0], f.url]),
  );
  return list
    .filter((f) => !f.name.includes('.poster.'))
    .map((f) => {
      const video = /\.(mp4|webm)$/i.test(f.name);
      return {
        url: f.url,
        type: video ? 'video' : 'image',
        poster: video ? posters[f.name.replace(/\.[^.]+$/, '')] : undefined,
        caption: caption(f.name),
      };
    });
}

export const coverFor = (slug) => mediaFor(slug).find((m) => m.type === 'image')?.url;
