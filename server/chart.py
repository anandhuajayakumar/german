from sklearn.metrics import classification_report
from sklearn import preprocessing
import pandas as pd
import numpy as np
# from __future__ import print_function
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from boruta import BorutaPy
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, roc_auc_score, f1_score, fbeta_score
from sklearn.metrics import confusion_matrix
from sklearn import metrics
from sklearn.preprocessing import StandardScaler
from keras import optimizers
from keras.models import Sequential
from keras.layers import Dense
from keras.wrappers.scikit_learn import KerasClassifier
from sklearn.model_selection import KFold
from sklearn.pipeline import Pipeline

from flask import json

pd.set_option('display.max_rows', 1000)
pd.set_option('display.max_columns', 1000)

class Chart:

    def __init__(self):

        df = pd.read_csv('german_credit_data.csv')

        # df.head(3)
        df = df.drop(columns=['Unnamed: 0'])

        # df.head(2)

        # df.describe()

        # df.isna().sum()

        # df.groupby(df['Saving accounts'])['Saving accounts'].size()

        df_back_mod = df
        df_forward_mod = df

        df_forward_mod = df_back_mod.fillna(method='ffill')
        # df_forward_mod.head(3)

        # df_forward_mod.isna().sum()

        # df_back_mod.groupby(df_back_mod['Saving accounts'])['Saving accounts'].size()

        # df_forward_mod.groupby(df_forward_mod['Saving accounts'])['Saving accounts'].size()

        df_back_mod = df_back_mod.fillna(method='bfill')
        # df_back_mod.head(3)

        cols = ["Sex", "Housing", "Saving accounts",
                "Checking account", "Purpose", "Risk"]
        le = preprocessing.LabelEncoder()
        df_back_mod[cols] = df_back_mod[cols].apply(le.fit_transform)

        X = df_back_mod.drop('Risk', axis=1).values
        self.y = df_back_mod['Risk'].values

        rfc = RandomForestClassifier(
            n_estimators=200, n_jobs=4, class_weight='balanced', max_depth=6)
        boruta_selector = BorutaPy(rfc, n_estimators='auto', verbose=2)
        boruta_selector.fit(X, self.y)

        feature_df = pd.DataFrame(df_back_mod.drop(
            ['Risk'], axis=1).columns.tolist(), columns=['features'])

        feature_df['rank'] = boruta_selector.ranking_
        feature_df = feature_df.sort_values(
            'rank', ascending=True).reset_index(drop=True)

        Ts = pd.DataFrame([df_back_mod['Age'], df_back_mod['Credit amount'], df_back_mod['Duration'],
                        df_back_mod['Saving accounts'], df_back_mod['Purpose'], df_back_mod['Checking account']]).T

        NTs = pd.DataFrame(
            [df_back_mod['Housing'], df_back_mod['Job'], df_back_mod['Sex']]).T

        self.Ts_new = Ts.copy()

        self.Ts_new['Housing'] = pd.Series(NTs['Housing'])
        # adding Housing to the original dataframe.

        Ts_new_1 = self.Ts_new.copy()
        # adding housing ,job to the original dataframe.
        Ts_new_1['Job'] = pd.Series(NTs['Job'])

        # Ts.head(3)

        Ts_new_2 = Ts_new_1.copy()
        # adding Sex,housing and job to the original dataframe.
        Ts_new_2['Sex'] = pd.Series(NTs['Sex'])

        # Ts_new_2.head(2)

        # Saving seed
        # divide_seed = np.random.randint(1, 100)

        # And then split the data
        self.X_train_1, self.X_test_1, self.y_train_1, self.y_test_1 = train_test_split(
            Ts, self.y, test_size=0.3)

        # And check if they splitted correctly
        # print(len(X_train_1))
        # print(len(X_test_1))
        # print(len(y_train_1))
        # print(len(y_test_1))
        
    def chart(self, pred_value):

        self.scaler = StandardScaler()

        # We normalize train sample
        self.scaler.fit(self.X_train_1)
        self.X_train_1 = self.scaler.transform(self.X_train_1)

        # And test sample
        # scaler.fit(X_test_2)
        data = [[pred_value['age'], pred_value['creditAmount'], pred_value['duration'], pred_value['savingAccount'], pred_value['purpose'], pred_value['checkingAccount']]]
        data_df = pd.DataFrame(data,columns=['Age', 'Credit amount', 'Duration', 'Saving accounts', 'Purpose', 'Checking account'])
        self.X_test_1 = self.scaler.transform(data_df)

        # X_train_1.shape

        # Saving seed
        # divide_seed = np.random.randint(1, 100)

        # And then split the data
        self.X_train_2, self.X_test_2, self.y_train_2, self.y_test_2 = train_test_split(
            self.Ts_new, self.y, test_size=0.3)

        # # And check if they splitted correctly
        # print(len(X_train_2))
        # print(len(X_test_2))
        # print(len(y_train_2))
        # print(len(y_test_2))

        self.scaler = StandardScaler()

        # We normalize train sample
        self.scaler.fit(self.X_train_2)
        self.X_train_2 = self.scaler.transform(self.X_train_2)

        # And test sample
        # scaler.fit(X_test_2)
        self.X_test_2 = self.scaler.transform(self.X_test_2)

        # X_train_2.shape

        self.clf = RandomForestClassifier(
            random_state=13, class_weight="balanced", max_depth=10, n_estimators=150)

        self.clf.fit(self.X_train_2, self.y_train_2)

        self.y_pred_2 = self.clf.predict(self.X_test_2)
        # print("Accuracy:", metrics.accuracy_score(self.y_test_2, self.y_pred_2))
        # print("matrix", confusion_matrix(self.y_test_2, self.y_pred_2))
        # print("auc", roc_auc_score(self.y_test_2, self.y_pred_2))
        # print("f1", f1_score(self.y_test_2, self.y_pred_2))
        # print("f2", fbeta_score(y_test, y_pred))


        # print('report', classification_report(self.y_test_2, self.y_pred_2))

        self.clf.fit(self.X_train_1, self.y_train_1)

        self.y_pred_1 = self.clf.predict(self.X_test_1)
        # print("Accuracy:", metrics.accuracy_score(self.y_pred_1, self.y_test_1))
        # print("matrix", confusion_matrix(self.y_test_1, self.y_pred_1))
        # print("auc", roc_auc_score(self.y_test_1, self.y_pred_1))
        # print("f1", f1_score(self.y_test_1, self.y_pred_1))
        # print("f2", fbeta_score(y_test, y_pred))


        # print('report', classification_report(self.y_test_1, self.y_pred_1))

        # import sklearn.metrics as metrics
        # calculate the fpr and tpr for all thresholds of the classification
        self.probs = self.clf.predict_proba(self.X_test_1)
        self.preds = self.probs[:, 1]
        self.fpr, self.tpr, self.threshold = metrics.roc_curve(self.y_test_1, self.preds)
        self.roc_auc = metrics.auc(self.fpr, self.tpr)
        js = json.dumps({'fpr': self.fpr.tolist(), 'tpr': self.tpr.tolist(), 'roc_auc': self.roc_auc})
        return(js)
        # method I: plt
        # import matplotlib.pyplot as plt
        # plt.title('Receiver Operating Characteristic')
        # print(fpr)
        # print(tpr)
        # plt.plot(fpr, tpr, 'b', label = 'AUC = %0.2f' % roc_auc)
        # plt.legend(loc = 'lower right')
        # # plt.plot([0, 1], [0, 1],'r--')
        # plt.xlim([0, 1])
        # plt.ylim([0, 1])
        # plt.ylabel('True Positive Rate')
        # plt.xlabel('False Positive Rate')
        # plt.show()
