<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'mail_address' => 'required|max:30',
            'password' => 'required|max:16|min:8',
        ];
    }

    public function attributes()
    {
        return [
            'mail_address' => 'メールアドレス',
            'password' => 'パスワード',
        ];
    }
}
