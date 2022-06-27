
export type venue = {
    id: string,
    name: string,
    tag: string,
    venue_name: string,
    venue_address: string
}

let venues: venue[] = [
    {
        id: "ven_774d6f7453397072766c67525955514475494a4b7978764a496843",
        name: "Gardermoen Lufthavn",
        tag: "OSL",
        venue_name: "oslo airport",
        venue_address: "norway"
    },
    {
        id: "ven_416744474c34505f65496b5259455077663336396d5a7a4a496843",
        name: "Bergen Lufthavn, Flesland",
        tag: "BGO",
        venue_name: "bergen airport",
        venue_address: "norway"
    },
    {
        id: "ven_4146517a786a387a50754452554578454c43654f2d7a444a496843",
        name: "Tromsø Lufthavn",
        tag: "TOS",
        venue_name: "Tromsø Airport",
        venue_address: "Flyplassvegen 31 9016 Tromsø Norway"
    },
    {
        id: "ven_344150527570457659517352596b4f4a5659714a52336c4a496843",
        name: "Stavanger Lufthavn, Sola",
        tag: "SVG",
        venue_name: "Stavanger lufthavn",
        venue_address: "Flyplassvegen Norway"
    },
    {
        id: "ven_594c47794639717149305f52595562564d2d566e785a5f4a496843",
        name: "Trondheim Lufthavn, Værnes",
        tag: "TRD",
        venue_name: "Trondheim Airport",
        venue_address: "Norway"
    },
    {
        id: "ven_7771437065776d644536785259454f425146676661374c4a496843",
        name: "Kristiansand Lufthavn",
        tag: "KRS",
        venue_name: "Kristiansand Lufthavn",
        venue_address: "Norway"
    },
    {
        id: "ven_4d3233564a79624a366d365255303351456c614b465a744a496843",
        name: "Bodø Lufthavn",
        tag: "BOO",
        venue_name: "Bodø Airport",
        venue_address: "Norway"
    },
    {
        id: "ven_306370347830524a43546c5255307a57385a6c693956334a496843",
        name: "Alta Lufthavn",
        tag: "ALF",
        venue_name: "Alta Airport",
        venue_address: "Altagårdskogen 32 9515 Alta Norway"
    },
    
]


export default venues