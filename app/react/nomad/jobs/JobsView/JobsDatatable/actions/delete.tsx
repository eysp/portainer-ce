import * as notifications from '@/portainer/services/notifications';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { Job } from '@/react/nomad/types';
import { deleteJob } from '@/react/nomad/jobs/jobs.service';

export async function deleteJobs(environmentID: EnvironmentId, jobs: Job[]) {
  return Promise.all(
    jobs.map(async (job) => {
      try {
        await deleteJob(environmentID, job.ID, job.Namespace);
        notifications.success('成功删除作业', job.ID);
      } catch (err) {
        notifications.error(
          '失败',
          err as Error,
          `无法删除作业 ${job.ID}`
        );
      }
    })
  );
}
