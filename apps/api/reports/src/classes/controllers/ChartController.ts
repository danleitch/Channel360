import { Request, Response } from "express";
import {
  BadRequestError,
  CreateSuccess,
  DeleteSuccess,
  GetSuccess,
  UpdateSuccess,
} from "@channel360/core";
import { IChart } from "@interfaces/IChart";
import ChartRepository from "@repositories/ChartRepository";

export interface IController<T> {
  list(req: Request, res: Response): Promise<Response>;

  get(req: Request, res: Response): Promise<Response>;

  create(req: Request, res: Response): Promise<Response>;

  update(req: Request, res: Response): Promise<Response>;

  delete(req: Request, res: Response): Promise<Response>;
}

export class ChartController implements IController<IChart> {
  async create(req: Request, res: Response) {
    const chartData = req.body;

    const chart = await ChartRepository.create(chartData);

    return new CreateSuccess(res).send("Chart created successfully", chart);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await ChartRepository.delete(id);

    return new DeleteSuccess(res).send();
  }

  async get(req: Request, res: Response) {
    const { orgId, id } = req.params;
    let { startDate, endDate } = req.query as {
      startDate: string;
      endDate: string;
    };

    const result = await ChartRepository.getChartWithMetrics(id, {
      orgId,
      startDate,
      endDate,
    }).catch((error) => {
      throw new BadRequestError(error.message);
    });

    return new GetSuccess(res).send(result);
  }

  async list(_req: Request, res: Response) {
    const charts = await ChartRepository.list();

    return new GetSuccess(res).send(charts);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const chartDataToUpdate = req.body;

    const chart = await ChartRepository.update(id, chartDataToUpdate);

    return new UpdateSuccess(res).send("Chart Updated successfully", chart);
  }
}
