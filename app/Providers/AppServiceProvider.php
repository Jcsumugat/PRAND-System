<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    private $apiCode;
    private $apiPassword;
    private $email;
    private $apiUrl;
    private $testMode;

    public function __construct()
    {
        $this->apiCode = env('ITEXMO_API_CODE', '');
        $this->apiPassword = env('ITEXMO_API_PASSWORD', '');
        $this->email = env('ITEXMO_EMAIL', '');
        $this->apiUrl = 'https://api.itexmo.com/api/broadcast';
        $this->testMode = env('SMS_TEST_MODE', false); // Add test mode option
    }

    /**
     * Send SMS via ITEXMO
     */
    public function send(string $phoneNumber, string $message): array
    {
        try {
            $formattedNumber = $this->formatPhoneNumber($phoneNumber);

            Log::info('Sending SMS via ITEXMO', [
                'to' => $formattedNumber,
                'message' => substr($message, 0, 50) . '...',
                'test_mode' => $this->testMode
            ]);

            // If in test mode, just log and return success
            if ($this->testMode) {
                Log::info('SMS TEST MODE - No actual SMS sent', [
                    'to' => $formattedNumber,
                    'message' => $message
                ]);

                return [
                    'success' => true,
                    'message' => 'SMS logged in test mode (not actually sent)',
                    'test_mode' => true,
                    'data' => [
                        'Number' => $formattedNumber,
                        'Message' => $message
                    ]
                ];
            }

            // Prepare request data according to ITEXMO API
            $requestData = [
                'Email' => $this->email,
                'Password' => $this->apiPassword,
                'ApiCode' => $this->apiCode,
                'Number' => $formattedNumber,
                'Message' => $message,
            ];

            Log::info('ITEXMO Request', [
                'data' => array_merge($requestData, ['Password' => '***hidden***'])
            ]);

            $response = Http::asJson()->post($this->apiUrl, $requestData);

            $result = $response->json();

            Log::info('ITEXMO Response', ['result' => $result]);

            // Check if successful
            if (isset($result['Result']) && $result['Result'] === 'Success') {
                Log::info('SMS sent successfully via ITEXMO', [
                    'to' => $formattedNumber
                ]);

                return [
                    'success' => true,
                    'message' => 'SMS sent successfully',
                    'data' => $result
                ];
            }

            // Handle errors
            $errorMessage = $result['Message'] ?? 'Unknown error occurred';

            Log::error('ITEXMO SMS failed', [
                'error' => $errorMessage,
                'result' => $result
            ]);

            return [
                'success' => false,
                'error' => $errorMessage,
                'data' => $result
            ];
        } catch (\Exception $e) {
            Log::error('ITEXMO SMS exception', [
                'error' => $e->getMessage(),
                'to' => $phoneNumber
            ]);

            return [
                'success' => false,
                'error' => 'Failed to send SMS: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Format phone number for ITEXMO (format: 09xxxxxxxxx)
     */
    private function formatPhoneNumber(string $phoneNumber): string
    {
        // Remove any non-digit characters
        $cleaned = preg_replace('/[^0-9]/', '', $phoneNumber);

        // If starts with +63, replace with 0
        if (substr($cleaned, 0, 2) === '63') {
            return '0' . substr($cleaned, 2);
        }

        // If starts with 639, replace with 09
        if (substr($cleaned, 0, 3) === '639') {
            return '0' . substr($cleaned, 2);
        }

        // If already starts with 0, keep it
        if (substr($cleaned, 0, 1) === '0') {
            return $cleaned;
        }

        // If 10 digits without leading 0, add 0
        if (strlen($cleaned) === 10) {
            return '0' . $cleaned;
        }

        // Default: return as is
        return $cleaned;
    }

    public function checkBalance(): array
    {
        return [
            'success' => false,
            'message' => 'Please check your balance in ITEXMO dashboard at https://dashboard.itexmo.com/'
        ];
    }
}
