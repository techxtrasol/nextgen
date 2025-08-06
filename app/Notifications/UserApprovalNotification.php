<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserApprovalNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $status,
        public ?string $notes = null
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        if ($this->status === 'approved') {
            return (new MailMessage)
                ->subject('Welcome to NextGen Welfare!')
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('Great news! Your application to join NextGen Welfare has been approved.')
                ->line('You can now access your dashboard and start contributing to our welfare system.')
                ->action('Access Dashboard', route('dashboard'))
                ->line('Thank you for joining our community of disciplined individuals!');
        } else {
            return (new MailMessage)
                ->subject('NextGen Welfare Application Update')
                ->greeting('Hello ' . $notifiable->name . ',')
                ->line('We regret to inform you that your application to join NextGen Welfare was not approved at this time.')
                ->when($this->notes, function (MailMessage $message) {
                    return $message->line('Reason: ' . $this->notes);
                })
                ->line('You can address the concerns mentioned above and resubmit your application.')
                ->action('Resubmit Application', route('approval.resubmit'))
                ->line('Thank you for your interest in NextGen Welfare.');
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'status' => $this->status,
            'notes' => $this->notes,
        ];
    }
}
