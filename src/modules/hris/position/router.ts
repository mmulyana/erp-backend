import { Router } from "express";
import PositionController from "./controller";
import Validation from "../../../helper/validation";
import positionSchema from "./schema";

export default class PositionRoutes {
    public router: Router
    private controller: PositionController = new PositionController()
    private createSchema: Validation = new Validation(positionSchema.create)
    private updateSchema: Validation = new Validation(positionSchema.update)

    constructor() {
        this.router = Router()
        this.register()
    }

    protected register() {
        this.router.patch('/:id', this.updateSchema.validate, this.controller.updateHandler)
        this.router.post('/', this.createSchema.validate, this.controller.createHandler)
        this.router.delete('/:id', this.controller.deleteHandler)
        this.router.get('/', this.controller.readAllHandler)
        this.router.get('/:id', this.controller.readHandler)
        this.router.get('/data/employee-by-position', this.controller.readTotalByPositionHandler)
        this.router.get('/data/employee-by-status', this.controller.readTotalByStatusnHandler)
    }
}