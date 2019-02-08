package com.zulapp;

import android.app.Application;
import com.chirag.RNMail.*;
import com.facebook.react.ReactApplication;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.masteratul.rn.testexception.RnTestExceptionHandlerPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.beefe.picker.PickerViewPackage;
import ui.bottomactionsheet.RNBottomActionSheetPackage;
import com.zyu.ReactNativeWheelPickerPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import fr.snapp.imagebase64.RNImgToBase64Package;
import com.imagepicker.ImagePickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.BV.LinearGradient.LinearGradientPackage;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNMail(),            
            new ReactNativeRestartPackage(),
            new RnTestExceptionHandlerPackage(),
            new ReactNativeExceptionHandlerPackage(),                    
            new FBSDKPackage(mCallbackManager),
            new PickerViewPackage(),
            new RNBottomActionSheetPackage(),
            new ReactNativeWheelPickerPackage(),
            new RNGoogleSigninPackage(),
            new RNImgToBase64Package(),
            new ImagePickerPackage(),
            new RNI18nPackage(),
            new SvgPackage(),
            new VectorIconsPackage(),
            new FingerprintAuthPackage(),
            new LinearGradientPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
public void onCreate() {
  super.onCreate();
  FacebookSdk.sdkInitialize(getApplicationContext());
  AppEventsLogger.activateApp(this);
  
}
}
