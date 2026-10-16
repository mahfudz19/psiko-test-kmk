<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WorkspaceCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public ?string $plainPassword = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Informasi Akun Resmi Gen-U Google Workspace',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->renderHtml(),
        );
    }

    private function renderHtml(): string
    {
        $workspaceEmail = htmlspecialchars($this->user->email ?? '-');
        $name = htmlspecialchars($this->user->name ?? '-');
        $registrationId = htmlspecialchars($this->user->registration_id ?? '-');
        $role = $this->user->role === 'guru' ? 'Guru BK' : 'Siswa';
        $school = htmlspecialchars($this->user->school ?? '-');
        $loginUrl = htmlspecialchars(url('/login'));
        $passwordNotice = $this->plainPassword
            ? "<p style='margin: 8px 0; font-family: monospace; font-size: 16px; font-weight: bold; color: #1e1b4b;'>{$this->plainPassword}</p>"
            : "<p style='margin: 8px 0; color: #4b5563; font-size: 14px;'>Gunakan password yang telah ditentukan oleh Administrator.</p>";

        return <<<HTML
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Informasi Akun Gen-U</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a;">
            <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                <div style="background: #4338ca; padding: 32px 24px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Selamat Datang di Gen-U</h1>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Akun Resmi Google Workspace Telah Aktif</p>
                </div>
                <div style="padding: 32px 24px;">
                    <p style="margin-top: 0; font-size: 15px; color: #334155;">Halo <strong>{$name}</strong>,</p>
                    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                        Pendaftaran akun Gen-U Anda ({$role} - {$school}) telah disetujui. Berikut adalah informasi kredensial akun Google Workspace resmi Anda yang dikelola oleh <strong>univeral.ac.id</strong>:
                    </p>
                    <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0;">
                        <div style="margin-bottom: 14px;">
                            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Nomor ID Registrasi:</span>
                            <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: bold; color: #0f172a; font-family: monospace;">{$registrationId}</p>
                        </div>
                        <div style="margin-bottom: 14px;">
                            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Email Google Workspace:</span>
                            <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #4338ca; font-family: monospace;">{$workspaceEmail}</p>
                        </div>
                        <div>
                            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Password Akun:</span>
                            {$passwordNotice}
                        </div>
                    </div>
                    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                        Anda dapat masuk ke platform Gen-U melalui opsi berikut:
                    </p>
                    <ul style="font-size: 14px; color: #475569; line-height: 1.6; padding-left: 20px;">
                        <li><strong>Login Manual</strong>: Menggunakan email <code>{$workspaceEmail}</code> dan password di atas.</li>
                        <li><strong>Login Google</strong>: Menggunakan tombol <em>"Lanjutkan dengan Google"</em> dengan akun <code>{$workspaceEmail}</code>.</li>
                    </ul>
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="{$loginUrl}" style="background: #4338ca; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Masuk ke Portal Gen-U</a>
                    </div>
                </div>
                <div style="border-top: 1px solid #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; background: #fafafa;">
                    Gen-U Platform &bull; Dikelola oleh univeral.ac.id
                </div>
            </div>
        </body>
        </html>
HTML;
    }

    private function renderText(): string
    {
        $name = $this->user->name ?? '-';
        $workspaceEmail = $this->user->email ?? '-';
        $registrationId = $this->user->registration_id ?? '-';
        $loginUrl = url('/login');
        $password = $this->plainPassword ?? 'Sesuai yang ditentukan oleh Administrator';

        return <<<TEXT
Halo {$name},

Pendaftaran akun Gen-U Anda telah disetujui. Berikut adalah informasi kredensial akun Google Workspace resmi Anda yang dikelola oleh univeral.ac.id:

- Nomor ID Registrasi: {$registrationId}
- Email Google Workspace: {$workspaceEmail}
- Password: {$password}

Silakan masuk ke platform Gen-U melalui tautan berikut:
{$loginUrl}

Salam,
Tim Administrator Gen-U
TEXT;
    }
}
