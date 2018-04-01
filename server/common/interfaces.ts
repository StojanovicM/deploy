export interface IRecord {
	"clientName" :string
    "clientId" :string
    "inputDate" :string
    "amount" :string
    "fileMetaDataId" :string
    "fileName" :string
    "source" :string
}

export interface IDataRow {
    "clientId": number
    "clientName" :string
    "inputDate" :string
    "amount" :string
    "fileName" :string
    "provider" :string
}

export interface ISingleRecord {
    clientName :string
    createdOn :Date
    fileNameList :string[]
    totalAmount :number
    totalRecords :number
}