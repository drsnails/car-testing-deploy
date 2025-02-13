// Car CRUDL API
import { loggerService } from '../../services/logger.service.js';
import { authService } from '../auth/auth.service.js';
import { userService } from '../user/user.service.js';
import { carService } from './car.service.js';

// List
export async function getCars(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            minSpeed: +req.query.minSpeed || 0,
            pageIdx: req.query.pageIdx || undefined
        }
        const cars = await carService.query(filterBy)
        res.send(cars)
    } catch (err) {
        res.status(400).send(`Couldn't get cars`)
    }
}

// Get
export async function getCar(req, res) {
    const { carId } = req.params
    const lastCarId = req.cookies.lastCarId
    try {
        if (lastCarId === carId) return res.status(400).send('Please wait a bit')
        const car = await carService.getById(carId)
        res.cookie('lastCarId', carId, { maxAge: 5 * 1000 })
        res.send(car)
    } catch (err) {
        res.status(400).send(`Couldn't get car`)
    }
}


// Delete
export async function removeCar(req, res) {

    const { carId } = req.params

    try {
        await carService.remove(carId, req.loggedinUser)
        res.send('Deleted OK')
    } catch (err) {
        loggerService.error(`Couldn't remove car: ${err}`)
        res.status(400).send(`Couldn't remove car: ${err}`)
    }
}


// Save
export async function addCar(req, res) {
    const loggedinUser = req.loggedinUser

    const { vendor, speed } = req.body

    const carToSave = { vendor, speed: +speed }

    try {
        const savedCar = await carService.save(carToSave, loggedinUser)
        res.send(savedCar)
    } catch (err) {
        res.status(400).send(`Couldn't save car`)
    }
}

export async function updateCar(req, res) {
    const loggedinUser = req.loggedinUser

    const { _id, vendor, speed } = req.body
    const carToSave = { _id, vendor, speed: +speed }

    try {
        const savedCar = await carService.save(carToSave, loggedinUser)
        res.send(savedCar)
    } catch (err) {
        res.status(400).send(`Couldn't save car`)
    }
}