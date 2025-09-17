"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AITaskScheduler from "@/components/tasks/AITaskScheduler";

const TaskSchedulerWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Task Scheduler</CardTitle>
        <CardDescription>Optimize your task priorities with AI</CardDescription>
      </CardHeader>
      <CardContent>
        <AITaskScheduler />
      </CardContent>
    </Card>
  );
};

export default TaskSchedulerWidget;