const indianStates = {
  Maharashtra: {
      districts: [
          { 
              name: "Pune", 
              talukas: [
                  { name: "Haveli", cities: ["Pune", "Wakad", "Hinjewadi"] },
                  { name: "Mulshi", cities: ["Lavasa", "Pirangut"] },
                  { name: "Shirur", cities: ["Shirur", "Ranjangaon"] },
                  { name: "Baramati", cities: ["Baramati", "Malegaon"] }
              ] 
          },
          { 
              name: "Mumbai", 
              talukas: [
                  { name: "Andheri", cities: ["Andheri East", "Andheri West"] },
                  { name: "Borivali", cities: ["Borivali East", "Borivali West"] },
                  { name: "Dadar", cities: ["Dadar West", "Dadar East"] }
              ] 
          }
      ]
  },
  Gujarat: {
      districts: [
          { 
              name: "Ahmedabad", 
              talukas: [
                  { name: "Daskroi", cities: ["Naroda", "Bapunagar"] },
                  { name: "Sanand", cities: ["Sanand", "Bavla"] },
                  { name: "Viramgam", cities: ["Viramgam", "Mandal"] }
              ] 
          },
          { 
              name: "Surat", 
              talukas: [
                  { name: "Choryasi", cities: ["Surat", "Udhna"] },
                  { name: "Bardoli", cities: ["Bardoli", "Mahuva"] },
                  { name: "Kamrej", cities: ["Kamrej", "Kosamba"] }
              ] 
          }
      ]
  }
};

export default indianStates;
