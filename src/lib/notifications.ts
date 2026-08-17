import { supabase } from './supabase';

const NOTIFICATION_FN = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-form-notification`;

type FormType = 'first_timer' | 'workforce' | 'testimony' | 'contact' | 'donation';

/**
 * Sends an admin email notification via Resend after a form is submitted.
 * Fire-and-forget: errors are logged but never thrown to avoid blocking the user.
 */
export async function notifyAdmins(
  formType: FormType,
  submissionData: Record<string, any>
): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(NOTIFICATION_FN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
      },
      body: JSON.stringify({
        form_type: formType,
        submission_data: submissionData,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.warn('[NOTIFICATION] Email notification failed:', err);
    } else {
      const result = await response.json().catch(() => ({}));
      console.log(
        '%c[NOTIFICATION]',
        'color: #e2b091; font-weight: bold',
        `Admin alert sent for '${formType}'.`,
        result
      );
    }
  } catch (err) {
    console.warn('[NOTIFICATION] Could not send admin notification:', err);
  }
}
