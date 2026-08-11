import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

/** Deliberately loose — enough to catch typos, not to police valid addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactErrors {
	name?: string;
	email?: string;
	message?: string;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const project = String(form.get('project') ?? '').trim();
		const budget = String(form.get('budget') ?? '').trim();
		const message = String(form.get('message') ?? '').trim();

		const errors: ContactErrors = {};
		if (!name) errors.name = 'Tell us who you are.';
		if (!email) errors.email = 'We need somewhere to reply.';
		else if (!EMAIL.test(email)) errors.email = 'That address does not look right.';
		if (!message) errors.message = 'Tell us what the space is doing wrong.';

		if (Object.keys(errors).length > 0) {
			// Values go back so a failed submit never wipes what was typed.
			return fail(400, { errors, values: { name, email, project, budget, message } });
		}

		// TODO(delivery): route the enquiry somewhere the studio actually reads.
		// See the note in the accompanying message — this is the one decision
		// that depends on how JBC works, not on the front end.
		await deliver({ name, email, project, budget, message });

		return { success: true };
	}
};

export interface Enquiry {
	name: string;
	email: string;
	project: string;
	budget: string;
	message: string;
}

/**
 * Hand the enquiry to whatever JBC actually uses — transactional email, a CRM
 * webhook, a Cloudflare queue, a D1 row. Until that is decided this logs and
 * resolves, so the form is end-to-end functional in development.
 */
async function deliver(enquiry: Enquiry): Promise<void> {
	console.log('[contact] enquiry received', {
		...enquiry,
		message: `${enquiry.message.length} chars`
	});
}
