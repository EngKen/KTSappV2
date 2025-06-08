<?php
/*
Plugin Name: Pool Table API
Description: Custom REST API endpoints for Pool Table Tracker
Version: 1.0
Author: Kentronics Solutions
*/

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add CORS headers
function add_cors_headers() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'add_cors_headers');

// Register REST API routes
function register_pool_table_routes() {
    register_rest_route('pooltable/v1', '/login', array(
        'methods' => 'POST',
        'callback' => 'handle_login',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'register_pool_table_routes');

// Handle login request
function handle_login($request) {
    $params = $request->get_params();
    $username = sanitize_text_field($params['username']);
    $password = $params['password'];

    // Authenticate user
    $user = wp_authenticate($username, $password);

    if (is_wp_error($user)) {
        return new WP_REST_Response(array(
            'success' => false,
            'message' => 'Invalid username or password'
        ), 401);
    }

    // Get user meta data
    $account_number = get_user_meta($user->ID, 'account_number', true);
    $phone_number = get_user_meta($user->ID, 'phone_number', true);

    // Generate authentication token
    $token = wp_generate_password(32, false);

    // Store token in user meta
    update_user_meta($user->ID, 'auth_token', $token);

    return new WP_REST_Response(array(
        'success' => true,
        'user' => array(
            'id' => $user->ID,
            'name' => $user->display_name,
            'accountNumber' => $account_number,
            'phoneNumber' => $phone_number
        ),
        'token' => $token
    ));
}

// Add custom user meta fields
function add_custom_user_meta_fields($user) {
    ?>
    <h3>Pool Table Account Information</h3>
    <table class="form-table">
        <tr>
            <th><label for="account_number">Account Number</label></th>
            <td>
                <input type="text" name="account_number" id="account_number" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'account_number', true)); ?>" 
                       class="regular-text" />
            </td>
        </tr>
        <tr>
            <th><label for="phone_number">Phone Number</label></th>
            <td>
                <input type="text" name="phone_number" id="phone_number" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'phone_number', true)); ?>" 
                       class="regular-text" />
            </td>
        </tr>
    </table>
    <?php
}
add_action('show_user_profile', 'add_custom_user_meta_fields');
add_action('edit_user_profile', 'add_custom_user_meta_fields');

// Save custom user meta fields
function save_custom_user_meta_fields($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }

    update_user_meta($user_id, 'account_number', sanitize_text_field($_POST['account_number']));
    update_user_meta($user_id, 'phone_number', sanitize_text_field($_POST['phone_number']));
}
add_action('personal_options_update', 'save_custom_user_meta_fields');
add_action('edit_user_profile_update', 'save_custom_user_meta_fields'); 