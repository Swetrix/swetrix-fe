import csvExport from 'csv-export'
import { saveAs } from 'file-saver'
import _map from 'lodash/map'
import _split from 'lodash/split'
import _replace from 'lodash/replace'

const getExportFilename = (suffix) => {
  // turn something like 2022-03-02T19:31:00.100Z into 2022-03-02
  const date = _split(_replace(_split(new Date().toISOString(), '.')[0], /:/g, '-'), 'T')[0]
  return `${suffix}-${date}.zip`
}

export const onCSVExportClick = (data, t) => {
  console.log(data)
  // csvExport.export(documents, (buffer) => {
  //   const blob = new Blob([buffer], { type: 'application/zip' })
  //   const filename = getExportFilename(activeMarket)

  //   saveAs(blob, filename)
  // })
}
