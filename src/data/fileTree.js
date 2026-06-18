export const fileTree = [
  { name: 'README.md', path: 'README.md', type: 'file' },
  { name: 'experience', type: 'folder', children: [
    { name: 'lockchain.md', path: 'experience/lockchain.md', type: 'file' },
    { name: 'gatech.md', path: 'experience/internships/gatech.md', type: 'file' },
    { name: 'internships', type: 'folder', children: [
      { name: 'mongodb.md', path: 'experience/internships/mongodb.md', type: 'file' },
      { name: 'kudelski_security.md', path: 'experience/internships/kudelski_security.md', type: 'file' },
      { name: 'newfields.md', path: 'experience/internships/newfields.md', type: 'file' },
    ]},
  ]},
  { name: 'projects', type: 'folder', children: [
    { name: 'eden.md', path: 'projects/eden.md', type: 'file', icon: '🎵' },
    { name: 'jsonic.md', path: 'projects/jsonic.md', type: 'file', icon: '{}' },
    { name: 'fish.md', path: 'projects/fish.md', type: 'file', label: 'fish.gba', icon: '🐟' },
    { name: 'narwarp.md', path: 'projects/narwarp.md', type: 'file', icon: '🐋' },
  ]},
  { name: 'photos', type: 'folder', path: 'photos', isGallery: true, children: [] },
  { name: 'contact.md', path: 'contact.md', type: 'file' },
]

export function getFileLabel(path) {
  function search(items) {
    for (const item of items) {
      if (item.path === path) return item.label || item.name
      if (item.children) { const r = search(item.children); if (r) return r }
    }
  }
  return search(fileTree) || path.split('/').pop()
}
export function getFileIcon(path) {
  function search(items) {
    for (const item of items) {
      if (item.path === path) return item.icon || null
      if (item.children) { const r = search(item.children); if (r) return r }
    }
  }
  return search(fileTree) || null
}
