function start(data) {
   data.VehicleTypes = []
   data.InfantryTypes = []
   data.BuildingTypes = []
   data.WeaponTypes = []
   data.register = {
      InfantryTypes: []
   }
   console.log('start')

}


function final(data) {


   console.log(data)


   return [
     ['name','zs'],
     ['age',12]
   ]
}




function vehicleIHandler(object, data) {
   console.log('vehicle')
   data.VehicleTypes.push(Math.random() + 'v')
}

function infantryIHandler(result, data) {
   console.log('infantry')
   data.InfantryTypes.push(Math.random() + 'i')
}


function buildingIHandler(object, data) {
   console.log('building')

}


function generalOHandler(object, data) {
   console.log('general')

}


function register(data) {
   console.log('register working')

   for (const key of data.InfantryTypes) {
      data.register.InfantryTypes.push(key)
   }

   console.log(data)

}