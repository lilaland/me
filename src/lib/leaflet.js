// leaflet.markercluster reads a global L, so set it before that plugin is imported.
import L from 'leaflet'

window.L = L

export default L
