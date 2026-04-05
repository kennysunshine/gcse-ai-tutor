/**
 * Sovereign Gatekeeper: Whop REST API Integration
 */

/**
 * Verify if a scholar has active membership for the LumenForge Product
 * Uses the Whop V1 REST API directly for maximum stability.
 */
export async function verifyScholarAccess(email: string): Promise<boolean> {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    console.warn('WHOP_API_KEY is missing. Access verification disabled.');
    return false;
  }

  try {
    // Whop V1 API: List memberships filtered by email and status
    const response = await fetch(`https://api.whop.com/v1/memberships?email=${encodeURIComponent(email)}&status=active`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      console.error('Whop API Error:', await response.text());
      return false;
    }

    const data = await response.json();

    // Whop returns a paginated list in 'data'
    // If any active membership exists, grant access
    return data && data.data && data.data.length > 0;
  } catch (error) {
    console.error('Whop Access Verification Unexpected Error:', error);
    return false;
  }
}
