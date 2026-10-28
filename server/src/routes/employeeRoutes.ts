
import { Router } from 'express'
import Employee from '../models/Employee.js'

const router = Router()

// GET all employees
router.get('/', async (_req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 })
    res.json({ success: true, count: employees.length, data: employees })
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch employees' })
  }
})

// GET one employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)

    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' })
      return
    }

    res.json({ success: true, data: employee })
  } catch {
    res.status(400).json({ success: false, message: 'Invalid employee ID' })
  }
})

// CREATE employee
router.post('/', async (req, res) => {
  try {
    const employee = await Employee.create(req.body)
    res.status(201).json({ success: true, data: employee })
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'Employee ID or email already exists',
      })
      return
    }

    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.message })
      return
    }

    res.status(500).json({ success: false, message: 'Failed to create employee' })
  }
})

// UPDATE employee
router.patch('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    )

    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' })
      return
    }

    res.json({ success: true, data: employee })
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.message })
      return
    }

    res.status(400).json({ success: false, message: 'Invalid employee data or ID' })
  }
})

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id)

    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' })
      return
    }

    res.json({ success: true, message: 'Employee deleted successfully' })
  } catch {
    res.status(400).json({ success: false, message: 'Invalid employee ID' })
  }
})

export default router
