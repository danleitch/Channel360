import express from "express";
import { ChartController } from "@controllers/ChartController";
import request from "supertest";
import mongoose from "mongoose";
import { NotificationSeeder } from "@seeders/NotificationSeeder";
import ChartRepository from "@repositories/ChartRepository";
import { IChart } from "@interfaces/IChart";

describe("ChartController 📜", () => {
  /**
   * Create and setup express router with each chart endpoint
   */

  const app = express();

  app.use(express.json());

  app.post("/charts", new ChartController().create);

  app.get("/webapi/orgs/:orgId/charts/:id", new ChartController().get);

  app.get("/charts", new ChartController().list);

  app.put("/charts/:id", new ChartController().update);

  app.delete("/charts", new ChartController().delete);

  /**
   * Test Cases
   */

  it("SHOULD create a chart 🧪", async () => {
    const title = "Message Stats";
    const strategyKey = "messageStats";

    const data = {
      title,
      strategyKey,
    };

    const response = await request(app).post("/charts").send(data);

    expect(response.status).toBe(201);
  });

  it("SHOULD get a chart 🧪", async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    const title = "Message Stats";
    const strategyKey = "messageStats";
    await NotificationSeeder.seed(orgId, 100);

    const data: IChart = {
      title,
      strategyKey,
      colors: ["#5cac34", "#3f51b5", "#ff9800", "#da2929"],
    };

    const chart = await ChartRepository.create(data);

    const response = await request(app).get(
      `/webapi/orgs/${orgId}/charts/${chart._id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.chart).toEqual(
      expect.objectContaining({
        colors: expect.arrayContaining([
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
        ]),
        series: expect.arrayContaining([
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
        ]),
        categories: expect.any(Array),
      }),
    );
  });

  it("SHOULD update a chart 🧪", async () => {
    const title = "Message Stats";
    const strategyKey = "messageStats";

    const data: IChart = {
      title,
      strategyKey,
    };

    const chart = await ChartRepository.create(data);

    const response = await request(app).put(`/charts/${chart._id}`).send({
      title: "Notification",
    });

    const updatedChart = await ChartRepository.get(chart._id);

    expect(response.status).toBe(200);

    expect(response.body.message).toEqual("Chart Updated successfully");

    expect(updatedChart.toObject()).toEqual(
      expect.objectContaining({
        title: "Notification",
      }),
    );
  });
});
