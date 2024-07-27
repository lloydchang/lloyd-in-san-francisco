import posthog from 'posthog-js'
import { browser } from '$app/environment';

export const load = async () => {

  if (browser) {
    posthog.init(
      'phc_AYZePJyIhEKyyxSXqeAwcMcHO51t4m7vV27dYg0kVut',
      { 
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
        capture_pageview: false,
        capture_pageleave: false
      }
    )
  }
  return
};