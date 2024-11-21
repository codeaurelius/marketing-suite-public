'use client';

import { api } from '@repo/database';
import { useQuery } from 'convex/react';

export default function Tasks() {
  const tasks = useQuery(api.tasks.getTasks);

  if (!tasks) {
    return null;
  }

  return (
    <>
      {tasks.map((task) => (
        <div key={task._id} className="aspect-video rounded-xl bg-muted/50">
          {task.text}
        </div>
      ))}
    </>
  );
}
