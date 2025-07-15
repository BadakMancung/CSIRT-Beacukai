# EMAIL NOTIFICATION SETUP - CSIRT Bea Cukai

## Overview
Sistem email notification memungkinkan admin mendapat notifikasi otomatis untuk:
- � Pesan kontak baru dari website
- 📅 Event baru yang ditambahkan
- 📰 Artikel baru yang dipublikasikan

## Setup Options

### Option 1: Simple Setup (.env only)
Untuk setup sederhana tanpa spreadsheet management:

```bash
# Email Configuration
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@csirt-beacukai.go.id
MAIL_FROM_NAME="CSIRT Bea Cukai"
```

### Option 2: Advanced Setup (Google Sheets + .env)
Untuk management email recipients yang dinamis:

1. **Update Google Apps Script** dengan `COMPLETE_GOOGLE_APPS_SCRIPT_V4.js`
2. **Buat sheet baru** bernama `email_notifications` dengan kolom:
   - id
   - email
   - name
   - role (admin/staff/supervisor)
   - notification_types (all/contacts/events/articles/combinations)
   - active (yes/no)
   - created_at
   - updated_at

3. **Akses Admin Panel** di `/admin/notifications` untuk manage recipients

## Email Provider Setup

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Go to Google Account Settings
   - Security > 2-Step Verification > App passwords
   - Generate password for "Mail"
3. Use App Password in `MAIL_PASSWORD`

### Other Providers
```bash
# Outlook/Hotmail
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587

# Yahoo
MAIL_HOST=smtp.mail.yahoo.com
MAIL_PORT=587

# Custom SMTP
MAIL_HOST=your-smtp-server.com
MAIL_PORT=587
```

## Notification Types

### 1. Contact Notifications
Triggered when: New contact form submitted via website
Recipients: All active recipients with 'contacts' or 'all' notification types
Template: `resources/views/emails/contact-notification.blade.php`

### 2. Event Notifications  
Triggered when: New event created in admin panel
Recipients: All active recipients with 'events' or 'all' notification types
Template: `resources/views/emails/event-notification.blade.php`

### 3. Article Notifications
Triggered when: New article published in admin panel
Recipients: All active recipients with 'articles' or 'all' notification types
Template: `resources/views/emails/article-notification.blade.php`

## Testing

### Test Email Function
1. Go to `/admin/notifications`
2. Enter email address in "Test Email" section
3. Click "Send Test" to verify configuration

### Manual Testing
```php
// In tinker or test controller
use App\Services\NotificationService;

$service = app(NotificationService::class);
$service->sendTestEmail('test@example.com');
```

## Configuration Files

### Key Files Modified:
- `app/Services/NotificationService.php` - Main notification service
- `app/Http/Controllers/NotificationController.php` - Admin management
- `resources/views/emails/` - Email templates
- `routes/web.php` - Admin routes added
- `COMPLETE_GOOGLE_APPS_SCRIPT_V4.js` - Enhanced Google Apps Script

### Email Templates:
- `contact-notification.blade.php` - For new contact forms
- `event-notification.blade.php` - For new events  
- `article-notification.blade.php` - For new articles
- `test-notification.blade.php` - For testing

## Troubleshooting

### Common Issues:

1. **"Mail driver [xxx] not supported"**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

2. **Gmail "Authentication failed"**
   - Use App Password, not regular password
   - Enable 2FA first

3. **"Connection could not be established"**
   - Check MAIL_HOST and MAIL_PORT
   - Verify firewall/network settings

4. **Emails not sending**
   - Check `storage/logs/laravel.log`
   - Verify MAIL_FROM_ADDRESS is valid
   - Test with simple .env setup first

### Debug Commands:
```bash
# Clear caches
php artisan config:clear
php artisan cache:clear

# Check mail configuration
php artisan tinker
> config('mail')

# Test notification service
> app(\App\Services\NotificationService::class)->sendTestEmail('test@example.com')
```

## Customization

### Adding New Notification Types:
1. Create new email template in `resources/views/emails/`
2. Add method to `NotificationService.php`
3. Call method from appropriate controller
4. Update notification types in admin interface

### Customizing Email Templates:
- Edit files in `resources/views/emails/`
- Use Laravel Blade syntax
- Include CSS inline for better email client support

## Security Notes

- Store email passwords as App Passwords, not account passwords
- Use environment variables, never hardcode credentials
- Regularly audit email recipient lists
- Monitor email sending logs for abuse

## Integration Example

```php
// In any controller
public function __construct(NotificationService $notificationService)
{
    $this->notificationService = $notificationService;
}

public function store(Request $request)
{
    $data = $request->validated();
    $record = Model::create($data);
    
    // Send notification
    $this->notificationService->sendCustomNotification($record);
    
    return redirect()->back()->with('success', 'Created and notification sent!');
}
```

## Support

For issues or customization needs:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Test email configuration with simple test first
3. Verify Google Sheets connectivity separately
4. Use browser network tools to debug API calls
