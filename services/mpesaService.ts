/**
 * M-Pesa Sandbox Service Simulation
 * 
 * In a real production environment, you would not call the Safaricom API directly
 * from the frontend due to CORS restrictions and security risks (exposing Consumer Key/Secret).
 * 
 * Instead, the frontend should call your own backend (Node.js/Python/etc.), 
 * which then authenticates with Safaricom and initiates the STK Push.
 * 
 * This service mimics that backend interaction for the demo.
 */

interface MpesaResponse {
    success: boolean;
    message: string;
    checkoutRequestID?: string;
}

export const mpesaService = {
    /**
     * Simulates initiating an STK Push (Lipa Na M-Pesa Online)
     * @param phoneNumber The phone number to charge (e.g., 254712345678)
     * @param amount The amount to charge
     */
    initiateSTKPush: async (phoneNumber: string, amount: number): Promise<MpesaResponse> => {
        // Simulate network delay for API Call
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Basic validation
        const phoneRegex = /^(?:254|\+254|0)?(7(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$/;
        
        // Remove spaces and special chars
        const cleanPhone = phoneNumber.replace(/[\s\-\+]/g, '');

        if (!cleanPhone.match(phoneRegex) && cleanPhone.length < 10) {
           throw new Error("Invalid phone number format. Use 2547XXXXXXXX.");
        }

        // Simulate Success/Failure
        // In sandbox, we assume success for valid inputs
        return {
            success: true,
            message: `STK Push sent to ${phoneNumber}. Please enter your M-Pesa PIN to complete the transaction of KES ${amount}.`,
            checkoutRequestID: "ws_CO_DMZ_" + Date.now()
        };
    },

    /**
     * Simulates polling for transaction status
     */
    checkTransactionStatus: async (checkoutRequestID: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 4000));
        return true; // Simulate paid
    }
};
