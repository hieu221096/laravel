<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Google\Cloud\BigQuery\BigQueryClient;
use venor\google\cloud\Core\src\ExponentialBackoff;

class UserController extends Controller
{
    public function index(Request $request){
        if(Auth::check()){
            dd('you are login yet');
        }
        return view("login/index");
    }

    public function login(LoginRequest $request){
        $credentials = $request->only('mail_address', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            
            return redirect('/login');
        }else{
            return back()->withErrors([
                'mail_address' => 'no user',
                'password' => '',
            ])->withInput([
                'mail_address' => $request->get('mail_address'),
            ]);
        }

        return view("login/index");
    }

    public function logout(Request $request){
        $response = Http::get('https://api.shop-pro.jp/oauth/authorize?client_id=28963d1dd4547b8c313183ff9db2d7105b20ad526a67cb69ac1cc7ceae8573f4&redirect_uri=https://google.com&response_type=code&scope=read_products%20write_products');
        
        $html = $response->body();

        return view("login/index" , ['html' => $html]);
    }
}
