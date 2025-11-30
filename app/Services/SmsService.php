<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $apiKey;
    protected $senderName;
    protected $client;

    public function __construct()
    {
        $this->apiKey = config('services.semaphore.api_key');
        $this->senderName = config('services.semaphore.sender_name', 'PRAND');
        $this->client = new Client();
    }

    /**
     * Send a basic SMS message
     */
    public function send($recipient, $message)
    {
        try {
            $response = $this->client->post('https://api.semaphore.co/api/v4/messages', [
                'form_params' => [
                    'apikey' => $this->apiKey,
                    'number' => $this->formatPhoneNumber($recipient),
                    'message' => $message,
                    'sendername' => $this->senderName
                ]
            ]);

            $result = json_decode($response->getBody()->getContents(), true);

            Log::info('SMS sent successfully', [
                'recipient' => $recipient,
                'response' => $result
            ]);

            return [
                'success' => true,
                'data' => $result
            ];

        } catch (\Exception $e) {
            Log::error('SMS sending failed', [
                'recipient' => $recipient,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Format phone number to international format
     */
    protected function formatPhoneNumber($number)
    {
        $number = preg_replace('/[^0-9]/', '', $number);
        
        if (strlen($number) === 10) {
            return '63' . $number;
        }
        
        if (strlen($number) === 11 && substr($number, 0, 1) === '0') {
            return '63' . substr($number, 1);
        }
        
        if (strlen($number) === 12 && substr($number, 0, 2) === '63') {
            return $number;
        }
        
        return $number;
    }

    /**
     * Format currency for SMS
     */
    protected function formatCurrency($amount)
    {
        return '₱' . number_format($amount, 2);
    }

    /**
     * Format date for SMS
     */
    protected function formatDate($date)
    {
        if (!$date) return 'N/A';
        return date('F j, Y', strtotime($date));
    }

    /**
     * Calculate days overdue
     */
    protected function calculateDaysOverdue($dueDate)
    {
        if (!$dueDate) return 0;
        
        $today = new \DateTime();
        $due = new \DateTime($dueDate);
        $diff = $today->diff($due);
        
        return $diff->days * ($diff->invert ? 1 : -1);
    }

    /**
     * Send renewal notice with comprehensive details
     */
    public function sendRenewalNotice($recipient, $fullname, $nextOfKinName, $tombNumber, $dueDate, $amountDue = null)
    {
        $message = "Dear {$nextOfKinName},\n\n";
        $message .= "Renewal reminder from PRAND - Municipality of Culasi.\n\n";
        $message .= "Record: {$fullname}\n";
        $message .= "Tomb: {$tombNumber}\n";
        $message .= "Renewal Due: " . $this->formatDate($dueDate) . "\n";
        
        if ($amountDue) {
            $message .= "Amount: " . $this->formatCurrency($amountDue) . "\n";
        }
        
        $message .= "\nPlease visit the municipal office to process your renewal.\n\n";
        $message .= "Thank you.";

        return $this->send($recipient, $message);
    }

    /**
     * Send payment reminder with balance and due date
     */
    public function sendPaymentReminder($recipient, $fullname, $nextOfKinName, $tombNumber, $balance, $dueDate = null)
    {
        $message = "Dear {$nextOfKinName},\n\n";
        $message .= "Payment reminder from PRAND - Municipality of Culasi.\n\n";
        $message .= "Record: {$fullname}\n";
        $message .= "Tomb: {$tombNumber}\n";
        $message .= "Balance Due: " . $this->formatCurrency($balance) . "\n";
        
        if ($dueDate) {
            $message .= "Due Date: " . $this->formatDate($dueDate) . "\n";
        }
        
        $message .= "\nPlease settle your payment at the municipal office at your earliest convenience.\n\n";
        $message .= "Thank you.";

        return $this->send($recipient, $message);
    }

    /**
     * Send overdue notice with specific details
     */
    public function sendOverdueNotice($recipient, $fullname, $nextOfKinName, $tombNumber, $balance, $dueDate = null)
    {
        $daysOverdue = $dueDate ? $this->calculateDaysOverdue($dueDate) : 0;
        
        $message = "URGENT: Payment Overdue\n\n";
        $message .= "Dear {$nextOfKinName},\n\n";
        $message .= "Record: {$fullname}\n";
        $message .= "Tomb: {$tombNumber}\n";
        
        if ($daysOverdue > 0) {
            $message .= "Overdue by: {$daysOverdue} days\n";
        }
        
        $message .= "Balance Due: " . $this->formatCurrency($balance) . "\n";
        $message .= "\nPlease visit PRAND - Municipality of Culasi immediately to settle your account and avoid penalties.\n\n";
        $message .= "Thank you.";

        return $this->send($recipient, $message);
    }

    /**
     * Send custom message
     */
    public function sendCustomMessage($recipient, $message)
    {
        return $this->send($recipient, $message);
    }

    /**
     * Send payment confirmation
     */
    public function sendPaymentConfirmation($recipient, $fullname, $nextOfKinName, $tombNumber, $amountPaid, $remainingBalance, $receiptNumber)
    {
        $message = "Dear {$nextOfKinName},\n\n";
        $message .= "Payment received - PRAND Municipal Office\n\n";
        $message .= "Record: {$fullname}\n";
        $message .= "Tomb: {$tombNumber}\n";
        $message .= "Amount Paid: " . $this->formatCurrency($amountPaid) . "\n";
        $message .= "Receipt #: {$receiptNumber}\n";
        
        if ($remainingBalance > 0) {
            $message .= "Remaining Balance: " . $this->formatCurrency($remainingBalance) . "\n";
        } else {
            $message .= "Status: FULLY PAID\n";
        }
        
        $message .= "\nThank you for your payment.";

        return $this->send($recipient, $message);
    }
}