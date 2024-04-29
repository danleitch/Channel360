import { fetchCsvFromS3 } from "@helpers/csv";

describe("fetching csv from s3", ()=> {
  it("fetches csv from s3 that is comma seperated (,)", async()=> {
    const result = await fetchCsvFromS3("2024-02-17T14:29:44.194Z-CSV (1).csv")

    expect(result).toHaveLength(2)
  })
  it("fetches csv from s3 that is semi-colon seperated (;)", async()=> {
    const result = await fetchCsvFromS3("2024-02-17T14:31:40.294Z-CSV.csv")

    expect(result).toHaveLength(2)
  })
})