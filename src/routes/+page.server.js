import { PostHog } from 'posthog-node';

export async function load() {
  const posthog = new PostHog('phc_AYZePJyIhEKyyxSXqeAwcMcHO51t4m7vV27dYg0kVut', 
  { host: 'https://us.i.posthog.com' });
  posthog.capture({
    distinctId: 'distinct_id_of_the_user',
    event: 'event_name',
  })
  await posthog.shutdown()
}